import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from '@daskalos/core';

@NgModule({
  imports: [CommonModule, HttpClientModule, CoreModule]
})
export class ApiModule {}
