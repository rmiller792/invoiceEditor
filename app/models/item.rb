class Item < ApplicationRecord
  # belongs_to :details, class_name:"InvoiceDetail"

  has_many :details, class_name:"InvoiceDetail"

end
