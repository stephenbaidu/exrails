class UserTpl

  def lookups
    lookups = {}
    
    begin
      associations = User.reflect_on_all_associations(:belongs_to).map { |a| a.name }
      associations.each do |assoc|
        lookups[assoc.to_s.to_sym] = assoc.to_s.classify.constantize.all
      end
    rescue Exception => e
    end
    
    lookups[:role] = Role.all

    lookups
  end

  def form_columns
    [
      {:name=>"name", :type=>"string", :label=>"Name"},
      {:name=>"username", :type=>"string", :label=>"Username"},
      {:name=>"email", :type=>"string", :label=>"Email"}
      # {:name=>"password", :type=>"password", :label=>"Password", disabled: true},
      # {:name=>"password_confirmation", :type=>"string", :label=>"Password Confirmation"}
      # {:name=>"encrypted_password", :type=>"string", :label=>"Encrypted Password"},
      # {:name=>"reset_password_token", :type=>"string", :label=>"Reset Password Token"},
      # {:name=>"reset_password_sent_at", :type=>"datetime", :label=>"Reset Password Sent At"},
      # {:name=>"remember_created_at", :type=>"datetime", :label=>"Remember Created At"},
      # {:name=>"sign_in_count", :type=>"integer", :label=>"Sign In Count"},
      # {:name=>"current_sign_in_at", :type=>"datetime", :label=>"Current Sign In At"},
      # {:name=>"last_sign_in_at", :type=>"datetime", :label=>"Last Sign In At"},
      # {:name=>"current_sign_in_ip", :type=>"string", :label=>"Current Sign In Ip"},
      # {:name=>"last_sign_in_ip", :type=>"string", :label=>"Last Sign In Ip"},
      # {:name=>"confirmation_token", :type=>"string", :label=>"Confirmation Token"},
      # {:name=>"confirmed_at", :type=>"datetime", :label=>"Confirmed At"},
      # {:name=>"confirmation_sent_at", :type=>"datetime", :label=>"Confirmation Sent At"},
      # {:name=>"unconfirmed_email", :type=>"string", :label=>"Unconfirmed Email"},
      # {:name=>"failed_attempts", :type=>"integer", :label=>"Failed Attempts"},
      # {:name=>"unlock_token", :type=>"string", :label=>"Unlock Token"},
      # {:name=>"locked_at", :type=>"datetime", :label=>"Locked At"},
    ]
  end

  def grid_columns
    [
      {:name=>"name", :type=>"string", :label=>"Name"},
      {:name=>"username", :type=>"string", :label=>"Username"},
      {:name=>"roles.length", :type=>"integer", :label=>"No. of Roles"},
      {:name=>"current_sign_in_at", :type=>"datetime", :label=>"Last Sign In"},
      {:name=>"current_sign_in_ip", :type=>"string", :label=>"Last IP"},
      {:name=>"email", :type=>"string", :label=>"Email"}
      # {:name=>"failed_attempts", :type=>"integer", :label=>"Failed Attempts"},
      # {:name=>"sign_in_count", :type=>"integer", :label=>"Sign In Count"},
      # {:name=>"last_sign_in_at", :type=>"datetime", :label=>"Last Sign In At"},
      # {:name=>"last_sign_in_ip", :type=>"string", :label=>"Last Sign In Ip"},
      # {:name=>"encrypted_password", :type=>"string", :label=>"Encrypted Password"},
      # {:name=>"reset_password_token", :type=>"string", :label=>"Reset Password Token"},
      # {:name=>"reset_password_sent_at", :type=>"datetime", :label=>"Reset Password Sent At"},
      # {:name=>"remember_created_at", :type=>"datetime", :label=>"Remember Created At"},
      # {:name=>"confirmation_token", :type=>"string", :label=>"Confirmation Token"},
      # {:name=>"confirmed_at", :type=>"datetime", :label=>"Confirmed At"},
      # {:name=>"confirmation_sent_at", :type=>"datetime", :label=>"Confirmation Sent At"},
      # {:name=>"unconfirmed_email", :type=>"string", :label=>"Unconfirmed Email"},
      # {:name=>"unlock_token", :type=>"string", :label=>"Unlock Token"},
      # {:name=>"locked_at", :type=>"datetime", :label=>"Locked At"},
    ]
  end
end