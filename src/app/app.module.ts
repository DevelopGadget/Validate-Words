import { NgModule } from '@angular/core';
import { HttpClientModule  } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule	} from '@angular/material/input';
import { MatCardModule	} from '@angular/material/card';
import { MatStepperModule	} from '@angular/material/stepper';
import { MatButtonModule	} from '@angular/material/button';
import { MatTreeModule	} from '@angular/material/tree';
import { MatProgressSpinnerModule	} from '@angular/material/progress-spinner';
import { FlexLayoutModule	} from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

const materialDefinition = [
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  FlexLayoutModule,
  MatStepperModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatTreeModule,
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ...materialDefinition
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
