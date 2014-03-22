class TplController < ActionController::Base
  include ::BaseInterop

  layout false
  
  before_action :initialize_variables

  before_action :render_view, except: [:create, :update]

  def index
    render "layouts/#{@namespace_prefix}layout_#{@app}" and return if (@app and !@model and layout_exists?)
    render "layouts/#{@namespace_prefix}layout_tpl_01"  and return if (@app and !@model and !layout_exists?)
  end

  def new
  end

  def show
  end

  def edit
  end

  def _config
    render json: {
      success: true,
      data: {
        formColumns: @model_class.tpl.form_columns,
        gridColumns: @model_class.tpl.grid_columns,
        columns: @model_class.tpl.form_columns,
        lookups: @model_class.tpl.lookups,
        options: @model_class.tpl.options
      }
    }
  end

  def _columns
    render json: @model_class.tpl.form_columns
  end

  def _lookups(get = false)
    render json: @model_class.tpl.lookups
  end

  private
    def initialize_variables
      # ****************************************************************
      # @namespace_prefix, eg: 'pos/', 'erp/pos/', ''
      # Blank for normal apps but must be specified for isolated engines
      # ****************************************************************
      @namespace_prefix = ''

      # Module name
      @app   = params[:app]

      # Model url, like underscored plural of model name
      @model = params[:model]

      # Sanitization
      @model.gsub!('-', '_') if @model
      @model = @model.underscore.pluralize if @model

      # Implied model resource class
      @model_class = "#{@model.classify}".constantize if @model
    end

    def layout_exists?() template_exists? "layouts/#{@namespace_prefix}layout_#{@app}" end

    def render_view
      return unless @app and @model && (@action = params[:action])

      paths = [
        "#{@namespace_prefix}#{@model}/#{params[:id]}",
        "#{@namespace_prefix}tpl/#{params[:id]}",
        "#{@namespace_prefix}#{@model}/#{@action}"
      ].each do |path|
        render path and return if template_exists? path
      end
    end

end