# Back to school

```typescript
class Carpet {
    w = 0;
    h = 0;
}

class Shop {
    price = 0;
}
```

Task: show area (w*h) and total price (area*price) on UI when user can modify w,h,price

Total price = area*price = w*h*price

-

Naive Angular 1 way:

```typescript

// html
{{ $ctrl.getTotal() }}

// ctrl
getTotal() { carpet.getArea() * shop.price }

```
PLOT TWIST! Slow imaginary computer does multiply operation in 100ms.


Q: How often does angular 1 run getTotal()?


Optimization:

- Cache 'area' for Carpet to reduce 1 multiplication, update on setter for w,h
- Cache 'total', update on setter for 'price' or area to eliminate all multiplications (aaaagh getting hard, don't do it)


Enter MobX:


```typescript
class Carpet {
    @observable w = 0
    @observable h = 0
}

class Shop {
    @observable price = 0;
}

const carpet = new Carpet()
const shop = new Shop()

// no more spamming the dirty checks, just wake up on changes
// every round still takes 200ms

autorun(() => {
    const area = carpet.w * carpet.h;
    console.log('area', area)
    console.log('total', area * shop.price)
})

# optimization 1: Carpet area can be computed

class Carpet {
    @observable w = 0
    @observable h = 0

    @computed // what happens when this attribute is not computed?
    get area() {
        return this.w * this.h;
    }
}

// how long a time does it take now? Only 100ms when price is changed.
autorun(() => {
    console.log('area', carpet.area)
    console.log('total', carpet.area * shop.price)
})

```

We still calculated stuff in autorun. Discuss why that's not optimal

Optimization 2: Everything is computed

```typescript
class FullExperienceService {
    @computed get area() {
        return this.carpet.x * this.carpet.y;
    }
    @computed get total() {
        return this.area * this.shop.price;
    }
}
```

When does mobx know that it should update total?


### createTransformer

Let's have richer data

```typescript
const TAX = 1.22;

class Shop {
    @observable
    prices = new Map<string, number>();

    getPriceForProduct(prodId: string) {
        return prices.get(prodId) * TAX;
    }
}

```

Now that needs to do multiplication (so we would like to cache it) but it also takes prodId. Need to switch to transformer:

```typescript
    getPriceForProduct = createTransformer((prodId: string) => {
        return prices.get(prodId) * TAX;
    });


    // ...
    const a = service.getPriceForProduct("gizmo")
    const b = service.getPriceForProduct("gizmo")
    // ...time passes...
    const c = service.getPriceForProduct("gizmo")

```
