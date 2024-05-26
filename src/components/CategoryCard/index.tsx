import React from "react";

import { Category } from "../../gql/graphql";

import { formatItemCount } from "../../utils/formatItemCount";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../@/components/ui/card";
import { Link } from "react-router-dom";

const CategoryCard: React.FC<{
  category: Category;
}> = ({ category }) => {
  return (
    <Link key={category.id} to={`/categories/${String(category.id)}`}>
      <Card className="cursor-pointer">
        {category.image_url && (
          <img
            className="w-full max-h-96 object-contain"
            src={category.image_url}
          />
        )}
        <CardHeader>
          <CardTitle>{category.name}</CardTitle>
          <CardDescription>
            {formatItemCount(category.itemCount)}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
};

export default CategoryCard;
