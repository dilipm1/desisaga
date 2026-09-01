Rails.application.routes.draw do
  resource :session
  get "login", to: "sessions#new", as: :login
  delete "logout", to: "sessions#destroy", as: :logout
  resources :passwords, param: :token

  root "pages#home"

  get "up" => "rails/health#show", as: :rails_health_check

  resources :products, only: %i[index show], param: :slug
  resource :cart, only: %i[show destroy]
  resources :cart_items, only: %i[create update destroy]
  get "checkout", to: "checkouts#show"
  post "checkout", to: "checkouts#create"
  get "checkout/success", to: "checkouts#success", as: :checkout_success

  post "basecamp/capture", to: "basecamp_callbacks#create"
  get "basecamp/capture", to: "basecamp_callbacks#show"

  namespace :admin do
    root to: "products#index", as: :root
    resources :products
  end

  match "*unmatched", to: "application#not_found", via: :all, constraints: lambda { |req|
    req.path.exclude? "rails/active_storage"
  }
end
