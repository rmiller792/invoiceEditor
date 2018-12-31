class ItemsController < ApplicationController
  skip_before_action :verify_authenticity_token, raise: false

  # GET /items
  # GET /items.json
  def index
    @items = Item.all
  end

  # GET /items/1
  # GET /items/1.json
  def show
  end

  # GET /items/new
  def new
    @item = Item.new
  end

  # GET /items/1/edit
  def edit
  end

  # POST /items
  # POST /items.json
  def create
    ActiveRecord::Base.transaction do
      @id = item_edit_params[:id]
      success = false

      if @id > 0
        @item = Item.new(item_edit_params)
        @item_original = Item.find_by_id(@id) 
        @item_original.name = @item.name
        @item_original.price = @item.price
        if @item_original.save
          success = true
        end
      else
        @item = Item.new(item_params)
        if @item.save
          success = true

        end
      end
      render json:{item: @item, success:success}

    end
  end

  # PATCH/PUT /items/1
  # PATCH/PUT /items/1.json
  def update
    respond_to do |format|
      if @item.update(item_params)
        format.html { redirect_to @item, notice: 'Item was successfully updated.' }
        format.json { render :show, status: :ok, location: @item }
      else
        format.html { render :edit }
        format.json { render json: @item.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /items/1
  # DELETE /items/1.json
  def destroy
    @item.destroy
    respond_to do |format|
      format.html { redirect_to items_url, notice: 'Item was successfully destroyed.' }
      format.json { head :no_content }
    end
  end


  def getAll
    @items = Item.all
    items = []
    @items.each do |i|
      item = {}
      item['itemId'] = i.id
      item['name'] = i.name
      item['price'] = i.price.to_f
      item['qty'] = 1
      items.push(item)
    end
    render json: items
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_item
      @item = Item.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def item_params
      params.require(:item).permit(:name, :price)
    end
    def item_edit_params
      params.require(:item).permit(:name, :price, :id)
    end
  end
