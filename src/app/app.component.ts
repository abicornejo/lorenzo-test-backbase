import {Component, OnInit} from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ITransaction } from './models/transaction';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

'./app'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'lorenzobackcasetest';
  products: any = [];
  trasaction : ITransaction;
  transactionList : ITransaction[] = [];
  filterargs = {column: null, order:'', search : ''};
  showModal = false;
  columnSelected = '';
  dateOrder = '';
  benOrder ='';
  amoOrder = '';
  typeOrder = null;
  searchInput = '';
  currentAmount = 5824.76;
  fromAccount =  `Free checking(4692) - $${this.currentAmount}`;
  toAccount = '';
  amountTrans = '';
  registerForm: FormGroup;
  submitted = false;

  constructor(private httpClient: HttpClient, private formBuilder: FormBuilder) {}

  ngOnInit() {
    window.document.body.classList.add('bg-img');

    this.registerForm = this.formBuilder.group({
      fromAccount: ['', Validators.required],
      toAccount: ['', Validators.required],
      amountTrans: ['', Validators.required]
    });

    this.httpClient.get("assets/transactions.json").subscribe(response => {
      // @ts-ignore
      if(response.data){
        // @ts-ignore
        this.transactionList = response.data.map(item =>{
          return {
            color : item.categoryCode,
            date: item.dates.valueDate,
            name:item.merchant.name,
            transactionType : item.transaction.type,
            amount: parseFloat(item.transaction.amountCurrency.amount)
          }
        });
      }
    });
  }

  formatDate(milliseconds){
    let date = new Date(milliseconds);
    const dateList = date.toDateString().split(' ');
    return `${dateList[1]} ${dateList[2]}`;
  }

  getImage(img){
    img = img.toString().toLowerCase().replace(/ /g,'-');
    return `assets/icons/${img}.png`;
  }

  showDetails(){
    this.showModal= true;
  }

  closeModal(){
    this.showModal= false;
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    if(parseFloat(this.amountTrans) > this.currentAmount){
      alert('The mount shouldn´t be greater than ' + this.currentAmount);
      return;
    }
    this.showDetails();
  }

  OrderColumn(e, column){
    e.preventDefault();
      this.typeOrder ='';
      if (column === 'date') {
        this.dateOrder = this.dateOrder === 'asc' ? 'desc' : 'asc';
        this.amoOrder ='';
        this.benOrder ='';
        this.typeOrder = this.dateOrder;
      } else if (column === 'name') {
        this.benOrder = this.benOrder === 'asc' ? 'desc' : 'asc';
        this.dateOrder ='';
        this.amoOrder ='';
        this.typeOrder = this.benOrder;
      } else if (column === 'amount'){
        this.amoOrder = this.amoOrder === 'asc' ? 'desc' : 'asc';
        this.dateOrder ='';
        this.benOrder ='';
        this.typeOrder = this.amoOrder;
      }

      this.columnSelected = column;
    this.setFilter(null);
  }
  setFilter($event){
    this.filterargs.column = this.columnSelected;
    this.filterargs.order = this.typeOrder;
    this.filterargs.search = this.searchInput;

  }
  getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  sendTransaction($event){
    $event.preventDefault();
    this.currentAmount = this.currentAmount - parseFloat(this.amountTrans);
    this.trasaction = {color : this.getRandomColor(),
      date: new Date().getTime(),
      name: this.toAccount,
      transactionType : 'Transaction',
      amount: parseInt(parseFloat(this.amountTrans).toFixed(2))}
    this.transactionList = [...this.transactionList,this.trasaction];
    this.toAccount ='';
    this.amountTrans = '';
    alert('Transaction Added Successfully!!');
    this.closeModal();
  }

  clean(){
    this.searchInput = '';
    this.setFilter(null);
  }

}
