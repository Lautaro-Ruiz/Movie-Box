import { Injectable } from '@angular/core';
import { UserService } from './user-service.service';
import { HttpClient } from '@angular/common/http';
import { Film } from '../models/film';
import { User } from '../models/user';
import { BehaviorSubject, count } from 'rxjs';
import { SharedServicesService } from './shared-services.service';

@Injectable({
  providedIn: 'root'
})
export class DeudaService {
  deuda: number = 0;
  urlJSONServer = 'http://localhost:5000/users';
  intervalId: any;
  countdowns: { [key: number]: string } = {};
  deudaSubject = new BehaviorSubject<number>(0);
  deuda$ = this.deudaSubject.asObservable();
  isCountingDown: boolean = false;
  isAlreadyCount: boolean = false;
  deudaIntervalId: any;
  movieLibrary: Film[] = [];
  contadorSubject = new BehaviorSubject<number>(0);
  contador$ = this.contadorSubject.asObservable();
  contador = 0;

  flag = false;

  countdownsSubject = new BehaviorSubject<{ [key: number]: string }>({});
  countdowns$ = this.countdownsSubject.asObservable(); // Observable para suscribirse

  deudaIntervals: { [key: number]: any } = {}; // Intervalos independientes por película

  constructor(private http: HttpClient, private userService: UserService) {
    userService.biblioteca$.subscribe(b => {
      if (b) {
        this.movieLibrary = b;
        if (this.movieLibrary.length != 0) {
          this.contadorPeliculasSinTiempo(this.movieLibrary);
          this.contador$.subscribe(c => {
            this.contador = c;
          })
        }
      }
    })
  }

  startDeudaPorPelicula(user: User, film: Film, montoPorIntervalo: number, isOne?: boolean) {
    if (this.deudaIntervals[film.id]) {
      return;
    }

    this.contador$.subscribe(c => {
      this.contador = c;
    })

    if (this.contador == this.movieLibrary.length) {
      this.clearInterval()
    }

    this.deudaIntervals[film.id] = setInterval(async () => {
      const timeRemaining = this.getTiempoRestanteDiezSegundos(film.fechaDeAgregado!);

      let userAux = await this.userService.getUserById(user.id)

      if (userAux && userAux != user) {
        user = userAux;
      }

      if (timeRemaining === '00:00:00') {
        await this.sumarDeudaPorPelicula(user, film, montoPorIntervalo, isOne);
      }
    }, 25000);
  }

  async sumarDeudaPorPelicula(user: User, film: Film, montoPorIntervalo: number, isOne?: boolean) {
    this.deuda = user.deuda
    if (isOne == true) {
      this.deuda += montoPorIntervalo; // Suma al total de deuda
    }
    else {
      this.deuda += montoPorIntervalo * this.contador; // Suma al total de deuda
    }

    this.deudaSubject.next(this.deuda);
    console.log ('USER EN SUMARDEUDAPORFILM: ', user)

    console.log(`Deuda acumulada de ${user.firstName} por película ${film.id}: ${this.deuda}`);
    await this.updateDeudaUser(user); // Actualiza en el backend
  }

  stopDeudaPorPelicula(film: Film) {
    if (this.deudaIntervals[film.id]) {
      clearInterval(this.deudaIntervals[film.id]);
      delete this.deudaIntervals[film.id]; // Limpia el intervalo
    }
  }

  contadorPeliculasSinTiempo(movieLibrary: Film[]): number {
    let cont = 0;
    for (let i = 0; i < movieLibrary.length; i++) {
      if (this.countdowns[movieLibrary[i].id] === "00:00:00") {
        cont++;
      }
    }

    this.contadorSubject.next(cont);
    return cont;
  }

  async getDeudaJSON(id: number) {
    try {
      const users = await this.http.get<User[]>(this.urlJSONServer).toPromise() || [];
      let user = users.find(user => user.id === id)
      if (user) {
        return user.deuda
      }
      else {
        return -1;
      }
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
      return -1;
    }
  }

  async updateDeudaUser(user: User) {
    const url = `${this.userService.urlJSONServer}/${user.id}`;

    user.deuda = this.deuda
    try {
      await this.http.patch(url, user).toPromise();
      this.userService.usuarioActualSubject.next(user);
      // this.userService.saveUserToStorage(user);
    } catch (error) {
      console.error('Error al guardar la deuda', error);
    }
  }

  getTiempoRestanteDiezSegundos(fechaDeAgregado: string): string {
    const hoy = new Date();
    const fechaAgregada = new Date(fechaDeAgregado);
    const diferencia = 10 * 1000 - (hoy.getTime() - fechaAgregada.getTime());

    if (diferencia <= 0) {
      return '00:00:00';
    }

    const segundos = Math.floor(diferencia / 1000);

    return `${segundos} s`;
  }

  startCountdownDiezSegundos(isOne?: boolean) {
    if (this.intervalId) {
      this.clearInterval();
    }

    this.contador$.subscribe((c) => {
      this.contador = c;
    });

    let user = this.userService.getUserFromStorage();

    this.userService.biblioteca$.subscribe(b => {
      if (b && b.length != this.movieLibrary.length) {
        this.movieLibrary = b;
      }
    })

    if (this.movieLibrary) {
      this.intervalId = setInterval(() => {
        this.contadorPeliculasSinTiempo(this.movieLibrary);

        this.movieLibrary.forEach((film) => {
          const timeRemaining = this.getTiempoRestanteDiezSegundos(film.fechaDeAgregado!);
          this.countdowns[film.id] = timeRemaining;

          if (user) {
            // Iniciar el acumulador de deuda para cada película
            this.startDeudaPorPelicula(user, film, 20, isOne);
          }
        });
      }, 1000); // Ejecutar cada segundo
      return true;
    }
    return false;
  }

  async startDeudasDeUsuarios(isOne?: boolean, movieLibrary?: Film[], userId?: number) {
    if (this.intervalId) {
      this.clearInterval();
    }

    this.contador$.subscribe((c) => {
      this.contador = c;
    });

    let users = await this.userService.getUsersFromJSON()
    console.log ("USUARIOS: ", users)

    if (users) {
      for (let i = 0; i < users.length; i++)
      {
        let currentLibrary: Film [] = [];
        if (users[i] && users[i].arrayPeliculas.length != 0)
        {
          if (movieLibrary && movieLibrary.length != 0)
          {
            if (users[i].id == userId)
            {
              currentLibrary = movieLibrary;
            }
          }
          else
          {
            currentLibrary = users[i].arrayPeliculas;
          }

          this.userService.bibliotecaSubject.next (currentLibrary);
          
          if (currentLibrary) {
            this.intervalId = setInterval(() => {
              this.contadorPeliculasSinTiempo(currentLibrary);

              currentLibrary.forEach((film) => {
                const timeRemaining = this.getTiempoRestanteDiezSegundos(film.fechaDeAgregado!);
                this.countdowns[film.id] = timeRemaining;
                
                this.countdownsSubject.next(this.countdowns);

                if (users)
                {
                  // Iniciar el acumulador de deuda para cada película
                  this.startDeudaPorPelicula(users[i], film, 20, isOne);
                }
              });
              
            }, 1000); // Ejecutar cada segundo
          }
        }
      }
    }
  }

  async forceRefresh (isOne?: boolean, movieLibrary?: Film[], userId?: number)
  {
    this.flag = true;
    await this.startDeudasDeUsuarios(isOne, movieLibrary, userId);
    this.flag = false;
  }

  clearInterval() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

