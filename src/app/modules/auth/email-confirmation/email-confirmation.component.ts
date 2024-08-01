import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'app/core/auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { NgIf } from '@angular/common';
import { ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-email-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './email-confirmation.component.html',
  animations: fuseAnimations
})
export class EmailConfirmationComponent implements OnInit{

  token: string | null = null;
  isConfirming: boolean = true;
  isConfirmed: boolean = false;
  errorMessage: string | null = null;
  confirmationStatus: 'pending' | 'success' | 'error' = 'pending';
  message: string | null = null;


  constructor(private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token');
    console.log(this.token)
    if (this.token) {
      this.confirmEmail(this.token);
    } else {
      this.isConfirming = false;
      this.errorMessage = 'Token no válido o no proporcionado.';
    }
  }

  confirmEmail(token: string): void {
    this.authService.confirmEmail(token).subscribe(
      response => {
        this.confirmationStatus = 'success';
        this.message = 'Correo confirmado exitosamente. Ahora puedes iniciar sesión.';
      },
      error => {
        this.confirmationStatus = 'error';
        this.message = 'Error al confirmar el correo. Por favor, inténtalo de nuevo.';
      }
    );
  }
}
