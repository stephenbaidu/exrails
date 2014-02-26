class RoleSerializer < ActiveModel::Serializer
  attributes :id, :name, :permissions, :users
end
