class ReportData < Struct.new(:values_hash)
  def method_missing(var)
    values_hash[var.to_s.to_sym]
  rescue
    nil
  end

  def append_data_point(key, value)
    values_hash[key.to_s.to_sym] = value
    true
  rescue
    false
  end
end

class ReportTpl

  def self.set_report_data(controller_instance, report_id, filter_string = "")
    # set filter
    values_hash = {}
    filter_string.to_s.split(',').each do |q|
      vals = q.split(':')
      if vals.count == 2
        values_hash[vals.first.to_sym] = vals.last
      end
    end
    @filter = ReportData.new(values_hash)
    controller_instance.instance_variable_set '@filter', @filter

    # set data
    @data = ReportData.new({})
    controller_instance.instance_variable_set '@data', @data
    if report_data = self.report_data(report_id)
      report_data.call(@filter, @data)
    end
  rescue Exception => e
    BaseInterop.log(e, 'Exception')
  end

  def self.pdf_options(_directory, report_id, options = {})
    defaults = {
      :pdf          => "#{report_id.classify}-#{Time.now.to_formatted_s(:number)}",
      :template     => self.template(_directory, report_id),
      :layout       => 'layout_pdf.html',
      :orientation  => self.orientation(report_id),
      :page_size    => self.page_size(report_id),
      :margin       => {
        :top => 35, :bottom => 20, :left => 10, :right => 10
      },
      :header       => {
        html: { template: 'reports/layouts/header.pdf.erb' }
      },
      :footer       => {
        html: { template: 'reports/layouts/footer.pdf.erb' }
      },
      :locals       => self.locals(report_id)
    }
    options.reverse_merge!(defaults)
  end

  def self.template(_directory, report_id)
    _val = value(report_id, :template)

    if !_val and File.exists? File.join(_directory, "#{report_id}.pdf.erb")
      "reports/#{report_id}.pdf"
    elsif !_val
      'reports/layouts/error.pdf'
    else
      _val
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

  def self.report_data(report_id)
    value(report_id, :report_data) || {}
  end

  def self.locals(report_id)
    value(report_id, :locals) || {}
  end

  private
    def self.config
      {
        users: {
          title: 'Users',
          template: 'reports/users.pdf',
          report_data: -> (filter, data) {
            data.append_data_point(:users, User.all)
          }
        },
        roles: {
          title: 'Roles',
          template: 'reports/roles.pdf',
          report_data: -> (filter, data) {
            data.append_data_point(:roles, Role.all)
          }
        },
        role_users: {
          title: 'Role Users',
          template: 'reports/role_users.pdf',
          filters: {
            role_id: { label: 'Role', lookup: Role.all }
          },
          report_data: -> (filter, data) {
            role = Role.where(id: filter.role_id).first
            data.append_data_point(:role, role)
            data.append_data_point(:users, User.all.select { |e| e.role_ids.include? role.id })
          }
        }
      }
    end

    def self.value(report_id, option_name)
      _config = config[report_id.to_s.to_sym] || {}
      _config[option_name.to_s.to_sym]
    end
end