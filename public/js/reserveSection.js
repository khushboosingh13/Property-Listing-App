 
    const checkinInput = document.getElementById('checkin');
    const checkoutInput = document.getElementById('checkout');
    const priceDisplay = document.getElementById('priceDisplay');
    // const pricePerNight = 3555;

    function calculatePrice() {
      const checkin = new Date(checkinInput.value);
      const checkout = new Date(checkoutInput.value);

     if (checkin && checkout && checkout > checkin) {
    // Convert both dates to UTC only for year, month, day (ignore time)
    const utcCheckin = Date.UTC(checkin.getFullYear(), checkin.getMonth(), checkin.getDate());
    const utcCheckout = Date.UTC(checkout.getFullYear(), checkout.getMonth(), checkout.getDate());

    const timeDiff = utcCheckout - utcCheckin;
    const nights = timeDiff / (1000 * 60 * 60 * 24); // Exact number of nights

    const totalPrice = nights * pricePerNight;

    priceDisplay.innerHTML = `<strong>₹${totalPrice.toLocaleString()}</strong> <span class="text-muted" style="font-size: 1rem;">for ${nights} night${nights > 1 ? 's' : ''}</span>`;
  }
    }

    checkinInput.addEventListener('change', calculatePrice);
    checkoutInput.addEventListener('change', calculatePrice);
  