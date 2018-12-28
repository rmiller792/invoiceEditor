class CreateInvoiceDetails < ActiveRecord::Migration[5.2]
  def change
    create_table :invoice_details do |t|
      t.integer :itemId
      t.integer :qty
      t.decimal :price, precision: 14, scale: 2
      t.decimal :total, precision: 14, scale: 2

      t.timestamps
    end
  end
end
