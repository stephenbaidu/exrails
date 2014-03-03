# == Schema Information
#
# Table name: roles
#
#  id          :integer          not null, primary key
#  name        :string(255)
#  permissions :text             default("--- []\n")
#  created_at  :datetime
#  updated_at  :datetime
#
# Indexes
#
#  index_roles_on_name  (name) UNIQUE
#

class Role < ActiveRecord::Base
  
  resourcify

  serialize :permissions, Array

  validates :name, presence: true, uniqueness: true

  def users
    # User.where('role_ids @> ARRAY[?]', self.id).count
    User.all.select { |e| e.role_ids.include?(self.id) }.count
  end
end
