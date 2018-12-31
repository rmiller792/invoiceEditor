class Invoice < ApplicationRecord

  has_many :details, class_name: "InvoiceDetail", dependent: :destroy

end
