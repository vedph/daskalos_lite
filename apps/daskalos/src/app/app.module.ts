import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { CoreModule } from '@daskalos/core';
import { MaterialModule } from '@daskalos/material';
import { UiModule } from '@daskalos/ui';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(
      [
        { path: '', redirectTo: 'home', pathMatch: 'full' },
        { path: 'home', component: HomeComponent },
        {
          path: 'flows/:id',
          loadChildren: () =>
            import('@daskalos/features/flow-run').then(
              module => module.FlowRunModule
            )
        },
        {
          path: 'results/:id',
          loadChildren: () =>
            import('@daskalos/features/flow-summary').then(
              module => module.FlowSummaryModule
            )
        }
      ],
      { useHash: true }
    ),
    CoreModule,
    MaterialModule,
    UiModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
