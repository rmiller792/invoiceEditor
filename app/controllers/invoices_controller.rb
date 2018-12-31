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

      @invoice = Invoice.new(invoice_params)

      details = params[:details]
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
    @invoice.destroy
    respond_to do |format|
      format.html { redirect_to invoices_url, notice: 'Invoice was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  def getAll
   @invoices = Invoice.all
   render json: @invoices

 end
 def print
   
@invoice = Invoice.find_by_id(params[:id])

      # render json: {estado_cuenta: @cuentas_ec, total_saldo:total_saldo, ultimaActualizacion: ultimaActualizacion.created_at}
   
    respond_to do |format|
      format.pdf do
        render pdf: "invoice", margin: {top: 0, left:0, right:0, bottom:0}, show_as_html: params.key?('debug'),
        :page_size => 'Letter'
      end
      format.html
    end  


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
  end
