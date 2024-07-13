# Ethglob Voting System

Ethglob Voting System is a web application designed to engage Ethglob participants in predicting the finalists out of all the competing teams. The system rewards the top predictor with 100 USDC, adding an exciting and competitive edge to the event.

## ⁉️ Description
We discovered that project submissions on ethglobal.com/showcase are accessible before the finalists are announced. Leveraging this insight, we created a platform for ETHGlobal Brussels attendees to bet on which projects will become finalists prior to the winner ceremony.

Each bettor can cast a number of votes to bet on different projects they believe will be finalists via our frontend. After the results are announced, incorrect bets incur negative points while correct bets earn positive points. A leaderboard is then generated, and the top scorer wins 100 USDC.

Attendees can easily join by scanning their NFC wristbands and betting transactions are signed directly by their NFC private keys.

## 📦 How it's made
```mermaid
graph TD
  A[User] -->|Signs up / Casts bets| B[Next.js Frontend]
  B -->|Sends data| C[Node Backend]
  C -->|Interacts with| D[Solidity Smart Contract]
  C -->|Verifies| E[NFC Signatures]
  C -->|Fetches| F[Projects from Showcase]
```

## 💻 Technical Preview

![stuff Logo](./img/project_chart.png)
