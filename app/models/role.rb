# == Schema Information
#
# Table name: roles
#
#  id          :integer          not null, primary key
#  name        :string(255)
#  permissions :string(255)      default([])
#  created_at  :datetime
#  updated_at  :datetime
#
# Indexes
#
#  index_roles_on_name  (name) UNIQUE
#

class Role < ActiveRecord::Base
  include Resourcify

  validates :name, presence: true, uniqueness: true

  def users
    User.where('role_ids @> ARRAY[?]', self.id).count
  end
end
