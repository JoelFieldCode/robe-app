import React from "react";
import { Item } from "../../gql/graphql";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../@/components/ui/card";
import { Link } from "react-router-dom";

const ItemCard: React.FC<{ item: Item }> = ({ item }) => {
  return (
    <Link to={`/items/${String(item.id)}`}>
      <Card>
        {item.image_url && (
          <img
            className="w-full max-h-96 object-contain"
            src={item.image_url}
          />
        )}
        <CardHeader>
          <CardTitle className="text-base">{item.name}</CardTitle>
          <CardDescription>${item.price}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
};

export default ItemCard;
