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

require 'rails_helper'

RSpec.describe Role, :type => :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
