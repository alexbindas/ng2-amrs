import { Component, OnInit } from '@angular/core';
import { PatientService } from '../patient.service';
import { Patient } from '../../models/patient.model';

import { Vital } from '../../models/vital.model';
import { TodaysVitalsService } from './todays-vitals.service';


@Component({
  selector: 'todays-vitals',
  templateUrl: 'todays-vitals.component.html',
  styleUrls: [],
})
export class TodaysVitalsComponent implements OnInit {
  patients: Patient = new Patient({});
  todaysVitals: Vital[] = [];
  errors: any[] = [];
  loadingTodaysVitals: boolean = true;
  dataLoaded: boolean = false;

  constructor(private patientService: PatientService, private vitalService: TodaysVitalsService) { }
  ngOnInit(): void {
    this.subscribeToPatientChangeEvent();
  }

  subscribeToPatientChangeEvent() {
    this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        if (patient) {
          this.loadTodaysVitalsForPatient(patient.person.uuid);
        }
      }
    );
  }

  loadTodaysVitalsForPatient(patientUuid: string) {
    this.resetVariables();
    if (patientUuid) {
      let params = { patientUuid: patientUuid };
      this.loadingTodaysVitals = true;
      let request = this.vitalService.getTodaysVitals(params);
      request
        .subscribe(
        (data) => {
          this.loadingTodaysVitals = false;
          if (data.length > 0) {
            this.todaysVitals = data;
            this.dataLoaded = true;
          } else {
            this.dataLoaded = false;
          }

        },
        (error) => {
          this.loadingTodaysVitals = false;
          this.dataLoaded = true;
          this.errors.push({
            id: 'Todays Vitals',
            message: 'error fetching todays vitals'
          });
        }
        );
    }
  }

  resetVariables() {
    this.todaysVitals = [];
    this.dataLoaded = false;
    this.loadingTodaysVitals = false;
  }


}


