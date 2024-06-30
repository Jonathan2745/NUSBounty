import { NavigationButtons } from "../src/components/NavigationButtons";
import { Collection, Card, Heading, Image, View, Badge, Flex, Divider, Button } from '@aws-amplify/ui-react';
import { StorageImage } from "@aws-amplify/ui-react-storage";

export const JobPage = () => {

    const items = [
        {
          title: 'Test Job #1',
          badges: ['High Pay', 'Verified'],
        },
        {
          title: 'Test Job #2',
          badges: ['Low Commitment', 'Verified'],
        },
      ];
      
    const handleClick = () => {
        alert("Not Implemented Yet!");
      };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-5xl mb-6 font-semibold">Jobs</h1>
      <NavigationButtons />
      <Collection
        items={items}
        type="list"
        direction="row"
        gap="20px"
        wrap="nowrap"
      >
        {(item, index) => (
          <Card
            key={index}
            borderRadius="medium"
            maxWidth="20rem"
            variation="outlined"
          >
            <StorageImage
              path = "public/cat.jpg"
              alt ="Glittering stream with old log, snowy mountain peaks tower over a green field."
            />
            <View padding="xs">
              <Flex>
                {item.badges.map((badge) => (
                  <Badge
                    key={badge}
                    backgroundColor={
                      badge === 'Waterfront' ? 'blue.40' 
                      : badge === 'Mountain' ? 'green.40' : 'yellow.40'}
                  >
                    {badge}
                  </Badge>
                ))}
              </Flex>
              <Divider padding="xs" />
              <Heading padding="medium">{item.title}</Heading>
              <Button variation="primary" isFullWidth onClick={handleClick}>
                Book it
              </Button>
            </View>
          </Card>
        )}
      </Collection>

    </div>
  );
};


