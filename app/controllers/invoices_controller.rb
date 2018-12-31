class InvoicesController < ApplicationController
  # before_action :set_invoice, only: [:show, :edit, :update, :destroy]
  skip_before_action :verify_authenticity_token, raise: false
  # GET /invoices
  # GET /invoices.json
  def index
    @invoices = Invoice.all
  end

  # GET /invoices/1
  # GET /invoices/1.json
  def show
  end

  # GET /invoices/new
  def new
    @invoice = Invoice.new
  end

  # GET /invoices/1/edit
  def edit
  end

  # POST /invoices
  # POST /invoices.json
  def create
    ActiveRecord::Base.transaction do
    @id = invoice_edit_params[:id]

      details = params[:details]

      if @id > 0
      @invoice = Invoice.new(invoice_edit_params)
       @invoice_original = Invoice.find_by_id(@invoice.id) 
       @invoice_original.subtotal = @invoice.subtotal
       @invoice_original.tax = @invoice.tax
       @invoice_original.total = @invoice.total
       if @invoice_original.save
        details_list = InvoiceDetail.where(invoice_id: @invoice.id)
        details_list.destroy_all
        details.each do |d|
          det = InvoiceDetail.new
          det.itemId = d["itemId"]
          det.invoice_id = @invoice.id
          det.itemId = d["itemId"]
          det.qty = d["qty"]
          det.price = d["price"]
          det.total = d["total"]
          det.save

        end
      end

    else
      @invoice = Invoice.new(invoice_params)

      if @invoice.save
        details.each do |d|
          det = InvoiceDetail.new
          det.itemId = d["itemId"]
          det.invoice_id = @invoice.id
          det.itemId = d["itemId"]
          det.qty = d["qty"]
          det.price = d["price"]
          det.total = d["total"]
          det.save

        end
      end
    end



    render json:{invoice: @invoice}

  end
end

  # PATCH/PUT /invoices/1
  # PATCH/PUT /invoices/1.json
  def update
    respond_to do |format|
      if @invoice.update(invoice_params)
        format.html { redirect_to @invoice, notice: 'Invoice was successfully updated.' }
        format.json { render :show, status: :ok, location: @invoice }
      else
        format.html { render :edit }
        format.json { render json: @invoice.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /invoices/1
  # DELETE /invoices/1.json
  def destroy
    ActiveRecord::Base.transaction do
      success = false
      @invoice = Invoice.includes(:details).find_by_id(params[:id])
      if @invoice.destroy
        success = true
      end
      render json: {success:success}
    end
  end

  def getAll
   @invoices = Invoice.includes(:details).all
   render json: @invoices

 end
 def print

  @invoice = Invoice.includes(:details).find_by_id(params[:id])


  respond_to do |format|
    format.pdf do
      render pdf: "invoice", margin: {top: 20, left:10, right:10, bottom:10}, show_as_html: params.key?('debug'),
      :page_size => 'Letter'
    end
    format.html
  end  


end

def getInvoice

  @invoice = Invoice.includes(:details).find_by_id(params[:id])

  @details = @invoice.details
  details = []
  @details.each do |i|
    detail = {}
    item = Item.find_by_id(i.itemId)
    detail['itemId'] = item.id
    detail['name'] = item.name
    detail['price'] = i.price.to_f
    detail['qty'] = i.qty
    detail['total'] = i.total
    details.push(detail)
  end
  render json: {invoice:@invoice, details: details }



end

private
    # Use callbacks to share common setup or constraints between actions.
    def set_invoice
      @invoice = Invoice.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def invoice_params
      params.require(:invoice).permit(:subtotal, :tax, :total)
    end
     def invoice_edit_params
      params.require(:invoice).permit(:subtotal, :tax, :total, :id)
    end
  end
