import { Routes } from '@angular/router';
import { ConfirmationRequiredClassicComponent } from 'app/modules/admin/pages/authentication/confirmation-required/confirmation-required.component';
import { ForgotPasswordClassicComponent } from 'app/modules/admin/pages/authentication/forgot-password/forgot-password.component';
import { ResetPasswordClassicComponent } from 'app/modules/admin/pages/authentication/reset-password/reset-password.component';
import { SignInClassicComponent } from 'app/modules/admin/pages/authentication/sign-in/sign-in.component';
import { SignOutClassicComponent } from 'app/modules/admin/pages/authentication/sign-out/sign-out.component';
import { SignUpClassicComponent } from 'app/modules/admin/pages/authentication/sign-up/classic/sign-up.component';
import { SignUpFullscreenReversedComponent } from 'app/modules/admin/pages/authentication/sign-up/fullscreen-reversed/sign-up.component';
import { SignUpFullscreenComponent } from 'app/modules/admin/pages/authentication/sign-up/fullscreen/sign-up.component';
import { SignUpModernReversedComponent } from 'app/modules/admin/pages/authentication/sign-up/modern-reversed/sign-up.component';
import { SignUpModernComponent } from 'app/modules/admin/pages/authentication/sign-up/modern/sign-up.component';
import { SignUpSplitScreenReversedComponent } from 'app/modules/admin/pages/authentication/sign-up/split-screen-reversed/sign-up.component';
import { SignUpSplitScreenComponent } from 'app/modules/admin/pages/authentication/sign-up/split-screen/sign-up.component';
import { UnlockSessionClassicComponent } from 'app/modules/admin/pages/authentication/unlock-session/classic/unlock-session.component';
import { UnlockSessionFullscreenReversedComponent } from 'app/modules/admin/pages/authentication/unlock-session/fullscreen-reversed/unlock-session.component';
import { UnlockSessionFullscreenComponent } from 'app/modules/admin/pages/authentication/unlock-session/fullscreen/unlock-session.component';
import { UnlockSessionModernReversedComponent } from 'app/modules/admin/pages/authentication/unlock-session/modern-reversed/unlock-session.component';
import { UnlockSessionModernComponent } from 'app/modules/admin/pages/authentication/unlock-session/modern/unlock-session.component';
import { UnlockSessionSplitScreenReversedComponent } from 'app/modules/admin/pages/authentication/unlock-session/split-screen-reversed/unlock-session.component';
import { UnlockSessionSplitScreenComponent } from 'app/modules/admin/pages/authentication/unlock-session/split-screen/unlock-session.component';

export default [
    // Sign in
    {
        path    : 'sign-in',
        children: [
            {
                path     : 'classic',
                component: SignInClassicComponent,
            },
        ],
    },
    // Sign up
    {
        path    : 'sign-up',
        children: [
            {
                path     : 'classic',
                component: SignUpClassicComponent,
            },
            {
                path     : 'modern',
                component: SignUpModernComponent,
            },
            {
                path     : 'modern-reversed',
                component: SignUpModernReversedComponent,
            },
            {
                path     : 'split-screen',
                component: SignUpSplitScreenComponent,
            },
            {
                path     : 'split-screen-reversed',
                component: SignUpSplitScreenReversedComponent,
            },
            {
                path     : 'fullscreen',
                component: SignUpFullscreenComponent,
            },
            {
                path     : 'fullscreen-reversed',
                component: SignUpFullscreenReversedComponent,
            },
        ],
    },
    // Sign out
    {
        path    : 'sign-out',
        children: [
            {
                path     : 'classic',
                component: SignOutClassicComponent,
            },
        ],
    },
    // Forgot password
    {
        path    : 'forgot-password',
        children: [
            {
                path     : 'classic',
                component: ForgotPasswordClassicComponent,
            }
        ],
    },
    // Reset password
    {
        path    : 'reset-password',
        children: [
            {
                path     : 'classic',
                component: ResetPasswordClassicComponent,
            }
        ],
    },
    // Unlock session
    {
        path    : 'unlock-session',
        children: [
            {
                path     : 'classic',
                component: UnlockSessionClassicComponent,
            },
            {
                path     : 'modern',
                component: UnlockSessionModernComponent,
            },
            {
                path     : 'modern-reversed',
                component: UnlockSessionModernReversedComponent,
            },
            {
                path     : 'split-screen',
                component: UnlockSessionSplitScreenComponent,
            },
            {
                path     : 'split-screen-reversed',
                component: UnlockSessionSplitScreenReversedComponent,
            },
            {
                path     : 'fullscreen',
                component: UnlockSessionFullscreenComponent,
            },
            {
                path     : 'fullscreen-reversed',
                component: UnlockSessionFullscreenReversedComponent,
            },
        ],
    },
    // Confirmation required
    {
        path    : 'confirmation-required',
        children: [
            {
                path     : 'classic',
                component: ConfirmationRequiredClassicComponent,
            }
        ],
    },
] as Routes;
