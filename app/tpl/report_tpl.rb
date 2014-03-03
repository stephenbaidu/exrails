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
        paye: { title: 'PAYE Report',
          filters: {
            payroll_month_id: { label: 'Payroll Period', lookup: PayrollMonth.all }
          }
        },
        summary_report: {
          filters: {
            payroll_month_id: { label: 'Payroll Period', lookup: PayrollMonth.all }
          }
        },
        bank_report: { orientation: 'Landscape', page_numbers: false,
          title: 'Bank Deposit',
          filters: {
            bank_id: { lookup: Bank.all },
            payroll_month_id: { label: 'Payroll Period', lookup: PayrollMonth.all }
          }
        },
        ssnit_1st_tier: {
          title: 'SSNIT Report (1st Tier)',
          filters: {
            payroll_month_id: { label: 'Payroll Period', lookup: PayrollMonth.all }
          }
        },
        ssnit_2nd_tier: {
          title: 'SSNIT Report (2nd Tier)',
          filters: {
            payroll_month_id: { label: 'Payroll Period', lookup: PayrollMonth.all }
          }
        },
        payslips: {
          title_: 'Payslip',
          filters: { id: { label: 'Select employee', lookup: Payroll.current.approved } }
        }
      }
    end

    def self.value(report_id, option_name)
      _config = config[report_id.to_s.to_sym] || {}
      _config[option_name.to_s.to_sym]
    end
end