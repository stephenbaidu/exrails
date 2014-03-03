# == Schema Information
#
# Table name: permissions
#
#  id         :integer          not null, primary key
#  name       :string(255)
#  created_at :datetime
#  updated_at :datetime
#
# Indexes
#
#  index_permissions_on_name  (name) UNIQUE
#

class Permission < ActiveRecord::Base

  validates :name, presence: true, uniqueness: true
end
