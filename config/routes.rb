EXRails::Application.routes.draw do

  devise_for :users, :path => "account", :path_names => { :sign_in => 'login', :sign_out => 'logout', :confirmation => 'verification', :unlock => 'unblock' }
    as :user do
      get 'account/password' => 'devise/registrations#edit',   :as => 'edit_user_registration'    
      put 'account/:id'  => 'devise/registrations#update', :as => 'user_registration'            
    end

  root to: 'application#init'

  get 'reports/:report(/:id)' => 'reports#index'

  get 'app/:app'  => 'tpl#index'
  
  resources :tpl, path: "tpl/:model" do
    get 'config'  => 'tpl#_config',  on: :collection
    get 'columns' => 'tpl#_columns', on: :collection
    get 'lookups' => 'tpl#_lookups', on: :collection
  end

  namespace :api do
    resources :users
    resources :api, path: ":resource_url"
  end
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

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
