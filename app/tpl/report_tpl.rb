class ReportTpl

  def self.pdf_options(report, options = {})
    defaults = {
      :pdf          => "#{report.dasherize}-#{Time.now.to_formatted_s(:number)}",
      :template     => ReportTpl.template(report),
      :layout       => 'layout_pdf.html',
      :orientation  => ReportTpl.orientation(report),
      :page_size    => ReportTpl.page_size(report),
      :header       => { html: { template: 'reports/layouts/header.pdf.erb' } },
      :footer       => {
        html: { template: 'reports/layouts/footer.pdf.erb' }
      },
      :locals       => ReportTpl.locals(report)
    }
    options.reverse_merge!(defaults)
  end

  def self.template(report_id)
    _val = value(report_id, :template)

    if !_val and File.exists? Rails.root.join('app', 'views', 'reports', "#{report_id}.pdf.erb")
      "reports/#{report_id}.pdf"
    elsif !_val
      'reports/partials/_error.pdf'
    end
  end

  def self.title(report_id)
    value(report_id, :title) || report_id.titleize
  end

  def self.orientation(report_id)
    value(report_id, :orientation) || 'Portrait'
  end

  def self.page_size(report_id)
    value(report_id, :page_size) || 'A4'
  end

  def self.page_numbers(report_id)
    value(report_id, :page_numbers) || false
  end

  def self.filters(report_id)
    value(report_id, :filters) || {}
  end

  def self.locals(report_id)
    value(report_id, :locals) || {}
  end

  private
    def self.config
      {
        paye: { title: 'Sample 1',
          filters: {
            user_id: { label: 'User', lookup: User.all }
          }
        },
        bank_report: { orientation: 'Landscape', page_numbers: false,
          title: 'Sample 2',
          filters: {
            user_id: { label: 'User', lookup: User.all },
            role_id: { lookup: Role.all }
          }
        }
      }
    end

    def self.value(report_id, option_name)
      _config = config[report_id.to_s.to_sym] || {}
      _config[option_name.to_s.to_sym]
    end
end