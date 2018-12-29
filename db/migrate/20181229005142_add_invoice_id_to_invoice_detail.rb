class AddInvoiceIdToInvoiceDetail < ActiveRecord::Migration[5.2]
  def change
    add_column :invoice_details, :invoice_id, :integer
  end
end
