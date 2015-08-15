class PdfBuilder
  attr_accessor :template_name, :report_data, :report_options

  def initialize(template_name, report_data = {}, report_options = {})
    @template_name  = template_name
    @report_data    = report_data
    @report_options = report_options
  end

  def get_kit
    begin
      kit = PdfBuilder.get(@template_name, @report_data, @report_options)
      kit
    rescue
      nil
    end
  end

  def save(file_path)
    begin
      get_kit.to_file(file_path)
    rescue
      false
    end
  end

  def as_pdf
    begin
      get_kit.to_pdf
    rescue
      nil
    end
  end

  def as_base64
    begin
      Base64.strict_encode64(get_kit.to_pdf)
    rescue
      nil
    end
  end

  class << self
    def get(template, data = {}, options = {})
      b = binding
      @data = data
      class << @data
        def method_missing(var)
          nil
        end
      end
      layout_path = Rails.root.join('app', 'views', 'pdfs', "layout.html.erb").to_s
      file_path = Rails.root.join('app', 'views', 'pdfs', "#{template}.html.erb").to_s
      html = File.read(layout_path)
      html.gsub! '<%= yield %>', File.read(file_path)

      html = ERB.new(html).result b
      pdf_options = default_report_options
      pdf_options.merge!(options)

      kit = PDFKit.new(html,
        page_size: pdf_options[:page_size],
        orientation: pdf_options[:orientation]
        )
      kit.stylesheets << Rails.root.join('app','views','pdfs','pdf.css').to_s

      kit
    end

    def default_report_options
      {
        page_size: 'A4',
        orientation: 'Portrait'
        # footer_center: 'Page [page] of [toPage]'
      }
    end
  end
end
