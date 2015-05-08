# == Schema Information
#
# Table name: permissions
#
#  id         :integer          not null, primary key
#  name       :string
#  status     :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_permissions_on_name  (name) UNIQUE
#

class Permission < ActiveRecord::Base

  validates :name, presence: true, uniqueness: true
end
