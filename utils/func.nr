fn main(min_lat: Field, max_lat: Field, min_long: Field, max_long: Field, user_lat: Field, user_long: Field) {
    let mut correct = 0;

    if (user_lat < max_lat) & (user_lat > min_lat) {
    correct = 1;
    }

    if (user_long < max_long) & (user_long > min_long) {
    correct = 1;
    } else {
      correct = 0;
    }

    constrain correct == 1;
}
