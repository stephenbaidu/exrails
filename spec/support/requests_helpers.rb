module Requests
  module Helpers
    def valid_user_without_permissions
      FactoryGirl.create(:user)
    end

    def valid_user_with_permissions(permission)
      FactoryGirl.create(:user, permission: permission)
    end

    def user_with_index_permission_for(resource_class)
      FactoryGirl.create(:user, permission: "#{resource_class}:index"
      )
    end

    def user_with_create_permission_for(resource_class)
      FactoryGirl.create(:user, permission: "#{resource_class}:create"
      )
    end

    def user_with_show_permission_for(resource_class)
      FactoryGirl.create(:user, permission: "#{resource_class}:show"
      )
    end

    def user_with_update_permission_for(resource_class)
      FactoryGirl.create(:user, permission: "#{resource_class}:update"
      )
    end

    def user_with_delete_permission_for(resource_class)
      FactoryGirl.create(:user, permission: "#{resource_class}:delete"
      )
    end

    def json_body
      @json_body ||= JSON.parse(response.body)
    end
  end
end