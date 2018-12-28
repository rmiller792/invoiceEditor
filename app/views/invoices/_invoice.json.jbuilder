json.extract! invoice, :id, :subtotal, :tax, :total, :created_at, :updated_at
json.url invoice_url(invoice, format: :json)
