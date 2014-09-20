class AddFieldsToResults < ActiveRecord::Migration
  def change
    add_column :results, :url, :string
    add_column :results, :image, :string
  end
end
