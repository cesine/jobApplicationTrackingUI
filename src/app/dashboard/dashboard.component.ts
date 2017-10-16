import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { CompanySchema, globalStructureSchema, RecruitersInfoSchema } from '../classDefinition';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'my-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  companyList: CompanySchema[] = [];
  RecrutersList: RecruitersInfoSchema[] = [];
  applicationType: string[] = ['Recruiters', 'Direct'];
  websiteList: string[] = ['', 'Indeed', 'Linkedin', 'ZipRecruters'];
  typeOfPosition: string[] = ['Front End Eng', 'NodeJs Eng', 'Senior Front-end', 'Senior Backend', 'Fullstack', 'Senior Fullstack'];
  base: globalStructureSchema = {
    id: undefined,
    location: '',
    website: '',
    applicationType: '',
    recruiters: '',
    company: '',
    title: '',
    description: '',
    date: undefined,
    application: false,
    answer_receive: false,
    meeting: [],
    notes: '',
    cover_letter: '',
  };
  submitted: boolean = false;

  constructor(
    private router: Router,
    private dashboardService: DashboardService
  ) { }

  ngOnInit(): void {
    this.dashboardService.getCompanyList()
      .then(companyList => {
        this.companyList = companyList;
      });
    this.dashboardService.getRecrutersList()
      .then(list => {
        this.RecrutersList = list;
      });
  }

  listPosition = (text$: Observable<string>) =>
    text$
      .debounceTime(100)
      .distinctUntilChanged()
      .map(term => term.length < 1 ? []
        : this.typeOfPosition.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10));

  onSubmit() {
    // Convert data and Post it.
    this.dashboardService.saveJob(this.base).then(answer => {
      this.submitted = true;
    });
  }

}
