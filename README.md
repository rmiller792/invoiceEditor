# README


Things you may want to cover:

* Ruby version 
  * V 2.3.7
* Ruby version 
  * V 5.2.2

* Gem dependencies



  * gem 'jquery-rails'
  * gem 'bootstrap', '~> 4.1.1'
  * gem 'bootstrap-editable-rails'
  * gem 'angularjs-rails'
  * gem 'wicked_pdf'
  * gem 'wkhtmltopdf-binary'
  * gem 'wkhtmltopdf-binary-edge'


### Installation

Dillinger requires [Node.js](https://nodejs.org/) v4+ to run.

Install the dependencies and devDependencies and start the server.

```sh

$ gem install rails
$ cd invoiceEditor
$ bundle install
$ rails serve
```


* Database creation
  * sqlite3
  * rake db:migrate

### Unit Test New Invoice Front

| Unit test | Description |
| ------ | ------ |
| Add Item | an item is added to the table details |
| Calculate item total | total = (price* qty) |
| Calculate invoice totals | Total sum of items |
| Finished button | do not leave save if there are no details |
| On Saved | generate PDF and reload page to generate new invoice |

### Unit Test New Invoice Back

| Unit test | Description |
| ------ | ------ |
| create | create new invoice with details |
| Edit | If exist, update data |
| Delete | Delete invoice and relations|
| get invoices | get invoices with details|

### Unit Test Show Invoice Front

| Unit test | Description |
| ------ | ------ |
| Show Invoices | get all invoices on table  |
| Edit Invoice | redirect to page new invoice and get data |
| Delete button | delete selected invoice |
| PDF button | generate pdf of the selected invoice |
| new Invoice | redirect to page new invoice |


### Unit Test New Item Front
| Unit test | Description |
| ------ | ------ |
| Add Item | open modal to create item|
| submit button | save item if data is correct(data required)|
| Edit item | Update Item |
| Show items | get Items |


### Unit Test New Item Back

| Unit test | Description |
| ------ | ------ |
| create | create new item |
| Edit | If exist, update data |
| get items | get all items |

