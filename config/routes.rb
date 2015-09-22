Rails.application.routes.draw do
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  scope 'api' do
    mount_devise_token_auth_for 'User', at: 'auth'

    get 'config/:model'  => 'config#show'
    get 'lookups/:model' => 'config#lookups'
    get 'schema/:model'  => 'config#schema'

    resources :users do
      post 'send_confirmation_instructions', on: :collection
      post 'lock', on: :member
      post 'unlock', on: :member
      post 'reset_password', on: :member
      post 'change_password', on: :member
      post 'bulk_upload', on: :member
    end
    resources :roles

    # Reports
    get 'reports/:action'  => 'reports#:action', :defaults => {
      :format => :html
    }, :constraints => {
      :format => /(html|csv|pdf)/
    }
  end

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
