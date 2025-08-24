from locust import HttpUser, task, between
import random

# Load tokens from tokens.txt (one per line)
with open("tokens.txt") as f:
    TOKENS = [line.strip() for line in f if line.strip()]


class FlashSaleUser(HttpUser):
    wait_time = between(1, 3)

    def on_start(self):
        # Each simulated user sticks with one token
        self.token = random.choice(TOKENS)

    @task(2)  # weight 2 = runs more often
    def purchase_product(self):
        headers = {
            "content-type": "application/json",
            "authorization": f"Bearer {self.token}",
        }
        payload = {"id": 1}  # example product id
        self.client.post("/product/purchase", headers=headers, json=payload)

    @task(1)  # weight 1 = runs less often
    def view_flash_sale(self):
        headers = {"authorization": f"Bearer {self.token}"}
        self.client.get("/product/flash-sale", headers=headers)
