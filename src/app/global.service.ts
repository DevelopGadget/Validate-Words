import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  private nounsPlurar: Array<string> = [];
  private nounsSingular: Array<string> = [];
  private personalPronouns: Array<string> = [];
  private possiveNouns: Array<string> = [];
  private toBeForms: Array<string> = [];
  private words: Array<string> = [];
  private properNouns: Array<string> = [];

  public subject: string = '';
  public verb: string = '';
  public complement: string = '';

  constructor(private readonly httpClient: HttpClient) { }

  public loadWords() {
    forkJoin([
      this.httpClient.get('assets/nounsPlurar.json'),
      this.httpClient.get('assets/nounsSingular.json'),
      this.httpClient.get('assets/personalPronouns.json'),
      this.httpClient.get('assets/possiveNouns.json'),
      this.httpClient.get('assets/toBeForms.json'),
      this.httpClient.get('assets/words.json'),
      this.httpClient.get('assets/properNouns.json'),
    ]).subscribe(res => {
      this.nounsPlurar = res[0] as Array<string>;
      this.nounsSingular = res[1] as Array<string>;
      this.personalPronouns = res[2] as Array<string>;
      this.possiveNouns = res[3] as Array<string>;
      this.toBeForms = res[4] as Array<string>;
      this.words = res[5] as Array<string>;
      this.properNouns = res[6] as Array<string>;
    })
  }

  public isValidSubject(words: Array<string>): boolean {
    if(this.personalPronouns.includes(words[0])) {
      this.subject = words[0];
      return true;
    } else if(this.properNouns.includes(words[0])) {
      this.subject = words[0];
      return true;
    } else if(words[0] === 'THE' && (this.nounsPlurar.includes(words[1]) || this.nounsSingular.includes(words[1]))) {
      this.subject = words.join(' ');
      return true;
    } else if(this.possiveNouns.includes(words[0]) && (this.nounsPlurar.includes(words[1]) || this.nounsSingular.includes(words[1]))) {
      this.subject = words.join(' ');
      return true;
    }
    return false;
  }

  public isValidVerb(word: string[]): boolean {
    if(this.toBeForms.includes(word[0])) {
      this.verb = word[0];
      return true;
    } else if(this.toBeForms.includes(word.join(' '))) {
      this.verb = word.join(' ');
      return true;
    }
    return false;
  }

  public isValidComplement(words: string[]): boolean {
    this.complement = words.join(' ');
    return words.every(item => this.words.includes(item)) && words.length > 0;
  }

}
