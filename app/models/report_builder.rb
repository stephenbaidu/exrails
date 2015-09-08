class ReportBuilder
  attr_accessor :pdf_kit, :template_name, :report_data, :report_options

  def initialize(template_name, report_data = {}, report_options = {})
    @template_name  = template_name
    @report_data    = report_data
    @report_options = report_options
  end

  def kit
    @pdf_kit ||= ReportBuilder.get(template_name, report_data, report_options)
    @pdf_kit
  end

  def save(file_path)
    begin
      kit.to_file(file_path)
    rescue
      false
    end
  end

  def as_pdf
    begin
      kit.to_pdf
    rescue
      nil
    end
  end

  def as_pdf_base64
    begin
      Base64.strict_encode64(kit.to_pdf)
    rescue
      nil
    end
  end

  def as_html
    begin
      kit.source.to_s.html_safe
    rescue
      nil
    end
  end

  def as_csv
    begin
      require 'csv'
      b = binding
      @data = @report_data
      class << @data
        def method_missing(var)
          nil
        end
      end
      file_path = Rails.root.join('app', 'views', 'reports', "#{@template_name}.csv.erb").to_s
      csv = File.read(file_path)
      csv = ERB.new(csv).result b
      p csv
      csv
    rescue Exception => e
      puts "************************"
      p e
      nil
    end
  end

  def as_xls
    begin
      b = binding
      @data = @report_data
      class << @data
        def method_missing(var)
          nil
        end
      end
      file_path = Rails.root.join('app', 'views', 'reports', "#{@template_name}.xls.erb").to_s
      xls = File.read(file_path)
      xls = ERB.new(xls).result b
      xls
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
      layout_path = Rails.root.join('app', 'views', 'reports', "layout.html.erb").to_s
      file_path = Rails.root.join('app', 'views', 'reports', "#{template}.html.erb").to_s
      html = File.read(layout_path)
      html.gsub! '<%= yield %>', File.read(file_path)

      html = ERB.new(html).result b
      pdf_options = default_report_options
      pdf_options.merge!(options)

      kit = PDFKit.new(html,
        page_size: pdf_options[:page_size],
        orientation: pdf_options[:orientation]
        )
      kit.stylesheets << Rails.root.join('app','views','reports','pdf.css').to_s

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
