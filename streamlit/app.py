import streamlit as st
import pandas as pd
import requests

base_url = 'https://5af9-43-252-237-83.ngrok-free.app'

# Function to get prediction data from the API
def get_prediction_data(commodity, num_days):
    url = f"{base_url}/linreg/predict?comodity={commodity}&num_days={num_days}"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        st.error("Failed to fetch prediction data.")
        return None

# Function to get articles from the API
def get_articles():
    url = f"{base_url}/get_articles"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json().get("results", [])
    else:
        st.error("Failed to fetch articles.")
        return []

# Streamlit UI
st.title("Commodity Price Prediction")
st.subheader("Visualize future predictions and read related articles.")

# User input for commodity and number of days
commodity = st.selectbox("Select a commodity", ["cabai", "bawang_merah", "bawang_putih"])
num_days = st.number_input("Enter number of prediction days", min_value=1, max_value=60, value=10)

# Fetch and display prediction data
data = get_prediction_data(commodity, num_days)
if data:
    dates = list(data["predictions"].keys())
    all_provinces = [data["predictions"][date]["All Provinces"] for date in dates]
    jakarta = [data["predictions"][date]["Jakarta"] for date in dates]
    west_java = [data["predictions"][date]["West Java"] for date in dates]

    df = pd.DataFrame({
        "Date": dates,
        "All Provinces": all_provinces,
        "Jakarta": jakarta,
        "West Java": west_java
    })
    df.set_index("Date", inplace=True)

    st.line_chart(df)
else:
    st.warning("No data available for the selected options.")

# Display articles
st.subheader("📰 Related Articles")
articles = get_articles()
if articles:
    for article in articles:
        with st.container():
            st.image(article["img_url"], width=250)
            st.markdown(f"### [{article['title']}]({article['link']})")
            st.caption(article["date"])
            st.write(article["description"])
            st.markdown("---")
else:
    st.info("No articles to display.")
