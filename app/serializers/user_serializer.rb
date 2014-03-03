class UserSerializer < ActiveModel::Serializer
  attributes :id, :name, :username, :email, :role_ids#, :roles
  attributes :current_sign_in_at, :current_sign_in_ip, :sign_in_count
end
