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

require 'rails_helper'

RSpec.describe Permission, :type => :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
