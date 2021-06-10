import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { GlobalService } from './global.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  host: { class: 'fullwidth' },
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}
  }]
})
export class AppComponent implements OnInit {

  public TREE_DATA: any[] = [
    {
      name: 'Subject',
      children: []
    },
    {
      name: 'Verb',
      children: []
    },
    {
      name: 'Complement',
      children: []
    },
  ];

  sentenceControl: FormControl = new FormControl('', [Validators.required, this.noWhitespaceValidator]);
  public isLoading = false;
  public isNotFirst = false;

  @ViewChild(MatStepper, { static: true })
  public stepper!: MatStepper;

  constructor(private readonly globalService: GlobalService) {
    this.globalService.loadWords();
    this.dataSource.data = this.TREE_DATA;
  }

  ngOnInit(): void {
  }

  public reset() {
    this.stepper.reset();
    this.stepper.steps.forEach(item => item.state = 'number');
    this.TREE_DATA.forEach(item => item.children = []);
    this.dataSource.data = this.TREE_DATA;
    this.stepper._stateChanged();
  }

  async validateSentence() {
    this.isLoading = true;
    this.isNotFirst = true;

    this.reset();

    let sentenceSplit = this.sentenceControl.value.toUpperCase().trim().split(' ');
    let stepOne = this.globalService.isValidSubject(sentenceSplit.slice(0, 2));
    await of(true).pipe(delay(1000)).toPromise();

    if(stepOne) {
      this.TREE_DATA[0].children = [{name: this.globalService.subject}];
      this.dataSource.data = this.TREE_DATA;

      this.stepper.next();
      let isBody = this.globalService.subject.split(' ').length >= 2;
      let stepTwo = this.globalService.isValidVerb(sentenceSplit.slice(isBody ? 2 : 1, isBody ? 4 : 3));
      await of(true).pipe(delay(1000)).toPromise();

      this.TREE_DATA[1].children = [{name: this.globalService.verb}];
      this.dataSource.data = this.TREE_DATA;

      if(stepTwo) {
        this.stepper.next();
        let isBodyVerb = this.globalService.verb.split(' ').length >= 2;
        console.log(sentenceSplit.slice(isBodyVerb ? 4 : 3));
        let stepThree = this.globalService.isValidComplement(sentenceSplit.slice(isBodyVerb ? 4 : 3));

        await of(true).pipe(delay(1000)).toPromise();

        if(stepThree) {

          this.TREE_DATA[2].children = [{name: this.globalService.complement}];
          this.dataSource.data = this.TREE_DATA;

          this.changeState(2, 'done');
        } else {
          this.changeState(2);
        }

      } else {
        this.changeState(1);
      }

    } else {
      this.changeState(0);
    }
  }

  public changeState(index: number, state: string = 'error') {
    this.stepper.steps!.get(index)!.editable = false;
    this.stepper.steps!.get(index)!.state = state;
    this.stepper._stateChanged();
    this.isLoading = false;
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  private _transformer = (node: any, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  }

  treeControl = new FlatTreeControl<any>(
      node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
      this._transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: any) => node.expandable;

}

