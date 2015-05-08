# == Schema Information
#
# Table name: roles
#
#  id          :integer          not null, primary key
#  name        :string
#  permissions :text             default([])
#  status      :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
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
    User.all.select { |e| e.role_ids.include?(self.id) }.count
  end
end
