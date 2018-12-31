Rails.application.routes.draw do

	get 'welcome/index'

	root 'welcome#index'


	get 'invoices/getInvoices', to: 'invoices#getAll'
	get 'invoices/create', to: 'invoices#create'
	get 'items/getAll', to: 'items#getAll'
	get 'invoices/print/:id', to: 'invoices#print'
	post 'invoices/save', to: 'invoices#create'
	post 'invoices/delete', to: 'invoices#destroy'


  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
