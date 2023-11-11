class Item < ApplicationRecord
  has_ancestry

  belongs_to :user
end
