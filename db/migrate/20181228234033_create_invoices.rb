class CreateInvoices < ActiveRecord::Migration[5.2]
  def change
    create_table :invoices do |t|
      t.decimal :subtotal, precision: 14, scale: 2
      t.decimal :tax, precision: 14, scale: 2
      t.decimal :total, precision: 14, scale: 2

      t.timestamps
    end
  end
end
